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
     * @Route("/", name="homepage", methods={"GET"})
     */
    public function index() {
        return $this->render('github/index.html.twig');
    }

    /**
     * @Route("/github/repos", name="show_repos", methods={"GET"}, options={"expose" = true})
     */
    public function showRepos(Request $request) {

        $query = $request->get('query');
        list ($username, $repoFilter) = explode('/', $query);

        $response = (new Client(['http_errors' => false]))->get('https://api.github.com/users/' . urlencode($username) . '/repos');
        $responseBody = json_decode($response->getBody(), true);

        if ($response->getStatusCode() === Response::HTTP_OK) {
            $data = [];
            foreach ($responseBody as $repo) {
                if (
                    ($repoFilter && strpos(strtolower($repo['name']), strtolower($repoFilter)) !== false) ||
                    !$repoFilter
                ) {
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
     * @Route("/github/contributors", methods={"GET"}, name="show_repo_contributors", options={"expose" = true})
     */
    public function showRepoContributors(Request $request) {

        $query = $request->get('query');

        list($username, $repoName) = explode('/', $query);

        if (!$username || !$repoName) {
            if (empty($body)) {
                return new JsonResponse([
                    'error' => 'Please give repo name in this format: username/repo_name'
                ], Response::HTTP_BAD_REQUEST);
            }
        }

        $res = (new Client(['http_errors' => false]))->get("https://api.github.com/repos/{$username}/{$repoName}/contributors");
        $statusCode = $res->getStatusCode();

        if ($statusCode === Response::HTTP_OK) {

            $body = json_decode($res->getBody(), true);
            if (empty($body)) {
                return new JsonResponse([
                    'error' => 'No contributors found for this repo'
                ], Response::HTTP_NOT_FOUND);
            }

            $names = [];
            $contributions = [];
            foreach ($body as $contributor) {
                $names[] = $contributor['login'];
                $contributions[] = $contributor['contributions'];
            }

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
