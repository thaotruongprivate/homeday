<?php

namespace App\Controller;

use GuzzleHttp\Client;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class GithubController extends Controller {

    /**
     * @Route("/github", name="github_homepage", methods={"GET"})
     */
    public function index() {
        return $this->render('github/index.html.twig');
    }

    /**
     * @Route("/github/repos", name="show_repos", methods={"POST"})
     */
    public function showUserRepos(Request $request) {
        $username = $request->get('username');
        $guzzle = new Client(['http_errors' => false]);
        $url = 'https://api.github.com/users/' . urlencode($username) . '/repos';

        $response = $guzzle->get($url);
        $responseBody = json_decode($response->getBody(), true);
        if ($response->getStatusCode() === Response::HTTP_OK) {

            $repoFilter = strtolower($request->get('repo'));
            $data = [];

            foreach ($responseBody as $repo) {
                if (($repoFilter && strpos(strtolower($repo['name']), $repoFilter) !== false) || !$repoFilter) {
                    $data[] = $repo['full_name'];
                }
            }

            if (empty($data)) {
                return new JsonResponse([
                    'error' => 'No repos found'
                ], Response::HTTP_NOT_FOUND);
            }

            return new JsonResponse([
                'repos' => $data
            ]);
        }

        return new JsonResponse([
            'error' => $response->getStatusCode() === Response::HTTP_NOT_FOUND ? 'This username is not found' :
                $responseBody['message']
        ], $response->getStatusCode());
    }

    /**
     * @Route("/github/repos/contributors", methods={"POST"}, name="show_repo_contributors")
     */
    public function showRepoContributors(Request $request) {
        $username = urlencode($request->get('username'));
        $repoName = urlencode($request->get('repo'));
        $guzzle = new Client(['http_errors' => false]);
        $url = "https://api.github.com/repos/{$username}/{$repoName}/contributors";

        $res = $guzzle->get($url);
        $statusCode = $res->getStatusCode();

        if ($statusCode === Response::HTTP_OK) {

            $body = json_decode($res->getBody(), true);
            if (empty($body)) {
                return new JsonResponse([
                    'error' => 'No contributors found for this repo'
                ], Response::HTTP_NOT_FOUND);
            }

            $names = array_map(function($elm) {
                return $elm['login'];
            }, $body);

            $contributions = array_map(function($elm) {
                return $elm['contributions'];
            }, $body);

            return new JsonResponse([
                'names' => $names,
                'contributions' => $contributions
            ]);
        }

        return new JsonResponse([
            'error' => \json_decode($res->getBody(), true)['message']
        ], $statusCode);
    }
}
